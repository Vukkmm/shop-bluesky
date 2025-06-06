package com.utc.nguyenvanvu.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.utc.nguyenvanvu.entity.Contact;
@Repository
public interface ContactRepository extends JpaRepository<Contact, Long> {

}
