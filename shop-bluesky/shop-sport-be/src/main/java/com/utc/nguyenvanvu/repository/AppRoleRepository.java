
package com.utc.nguyenvanvu.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.utc.nguyenvanvu.entity.AppRole;

@Repository
public interface AppRoleRepository extends JpaRepository<AppRole, Long> {
//	Optional<AppRole> findByName(ERole name);
}
